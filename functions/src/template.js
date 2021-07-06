const template = opts => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Document preview</title>
      <meta name="description" content="Document preview">
      <meta name="viewport" content="width=612">
    </head>
    <style type="text/css">
      *, *::before, *::after {
        box-sizing: border-box;
      }
      #root {
        width: 612px;
      }
      p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
      }
      h1, h2, h3, h4, h5, h6, p {
        margin: 0;
      }
    </style>
    ${opts.stylesheet}
    <body style="margin: 0">
      <div id="root">${opts.body}</div>
    </body>
  </html>
  `
}

export default template
