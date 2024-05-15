declare module 'node-php-password' {
 /// TODO add types if required.
       
    function hash(password : any, algorithm? : any, options? :  any ) {
        var algo;
        if(typeof algorithm == 'undefined'){
            algorithm = "PASSWORD_DEFAULT";
        }
        if(typeof options == 'undefined'){
            options = {};
        }
        if(typeof aliases[algorithm] !== 'undefined'){
            algorithm = aliases[algorithm];
        }
        if(typeof algorithms[algorithm] == 'undefined'){
            throw("exception unknown algorithm");
        }
        algo = algorithms[algorithm];
        return algo.hash(password, options);
    }

    function verify(){

    }

}