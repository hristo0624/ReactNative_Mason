var path = require('path')

module.exports = {
  // projectRoot: path.resolve(__dirname),
  watchFolders: [
    path.resolve(__dirname, '../shared')
  ],
  getProjectRoots () {
    /**
     * Add our workspace roots so that react native can find the source code for the included packages
     * in the monorepo
     */
    const projectPath = path.resolve(__dirname)
    const sharedPath = path.resolve(__dirname, '../shared')

    return [
      projectPath,
      sharedPath
    ]
  },
  resolver: {
    extraNodeModules: new Proxy({}, {
      get: (target, name) => {
        switch (name) {
          case 'shared':
            const p = path.resolve(process.cwd(), '../shared')
            // console.log('return path for shared', p)
            return p
          default: return path.join(process.cwd(), `node_modules/${name}`)
        }
      }
    })
  }
}