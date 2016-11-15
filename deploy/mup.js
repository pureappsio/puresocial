module.exports = {
  servers: {
    one: {
      host: 'xx.xx.xx.xx',
      username: 'root',
      pem: ""
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'puresocial',
    port: 3000,
    path: '../',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: '',
      MONGO_URL: 'mongodb://localhost/meteor',
      PORT: 3000
    },

    docker: {
      image:'abernix/meteord:base',
    },
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};