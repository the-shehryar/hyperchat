const path = require('path')
module.exports = {
    mode : 'development',
    entry : ["@babel/polyfill",'./scripts/main.js'],
    output : {
        filename : 'app.js',
        path : path.resolve(__dirname + '/scripts')
    },
    target : ['web', "es5"],
    module : {
        rules :[
            {
                test: /\.js$/,
                exclude : /(node_moudles)/,
                use : {
                    loader : 'babel-loader'
                }
            }
        ]
    }
}