const d3Url = 'http://lib.baomitu.com/d3/4.10.2/d3.min.js'

function loadScript(url) {
  let script = document.createElement('script')
  script.type = "text/javascript"
  script.src = url
  document.body.appendChild(script)

  return new Promise(resolve => {
    script.onload = () => {
      resolve()
    }
  }) 
}

const paper = spritejs.Paper2D('#paper').setResolution(1200, 900)

loadScript(d3Url).then(function(){

  const layer = paper.layer('fglayer', {
    handleEvent: false
  })

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400, 300));

  d3.json("/static/data/miserables.json", function(error, graph) {
    if (error) throw error

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)

    simulation.force("link")
        .links(graph.links)

    let path = new spritejs.Path()
    path.attr({
      size: [1200, 800],
      pos: [0, 100],
      //bgcolor: '#aaa',
    })
    layer.appendChild(path)

    d3.select(layer.canvas)
        .call(d3.drag()
            .container(layer.canvas)
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    function ticked() {
      path.drawOnce(context => {
        context.beginPath()
        graph.links.forEach(d => {
          const [sx, sy] = [d.source.x, d.source.y],
                [tx, ty] = [d.target.x, d.target.y]

          context.moveTo(sx, sy);
          context.lineTo(tx, ty);        
        })
        context.strokeStyle = "#aaa"
        context.stroke()

        context.beginPath()
        graph.nodes.forEach(d => {
          const [x, y] = [d.x, d.y]

          context.moveTo(x + 3, y);
          context.arc(x, y, 3, 0, 2 * Math.PI);        
        })
        context.fill()
        context.strokeStyle = "#fff"
        context.stroke()
      })
    }

    function dragsubject() {
      const [x, y] = paper.toLocalPos(d3.event.x, d3.event.y)
      return simulation.find(x, y - 100);
    }
  });

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    
    const [x, y] = [d3.event.subject.x, d3.event.subject.y]

    d3.event.subject.fx = x;
    d3.event.subject.fy = y;

    d3.event.subject.x0 = x;
    d3.event.subject.y0 = y;
  }

  function dragged() {
    const [x, y] = [d3.event.x, d3.event.y],
          {x0, y0} = d3.event.subject

    const [dx, dy] = paper.toLocalPos((x - x0), (y - y0))

    d3.event.subject.fx = x0 + dx;
    d3.event.subject.fy = y0 + dy;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }
})

window.addEventListener('resize', evt => {
  paper.setViewport('auto', 'auto')
})
