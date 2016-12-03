

validators = {

    forbiddenKeywords : ['admin','luckst','stockluck','st0ck'],

        errors : {
            username : 'Username is not valid!',
            email : 'Email is not valid!',
            password  : 'Password is not valid!',
            firstname : 'Firstname is not valid!',
            lastname : 'Lastname is not valid!'
        },

        // Check if value exists at all (for required fields)
        isSet : function (inp) {
            return inp !== undefined
                && inp !== null
                && inp.length !== 0
        },

        // Check if contains forbidden keywords
        containsForbiddenKewyords : function (inp) {
            return this.forbiddenKeywords.some((keyword) => {
                return inp.indexOf(keyword) !== -1
            })
        },

        minLength : function (len, inp) {
            return inp.length >= len
        },

        email : function(inp){
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(inp)
                && this.isSet(inp)
        },

        username : function (inp) {
            return this.isSet(inp)
                && /^[a-zA-Z0-9_]+$/i.test(inp)
                && this.minLength(5, inp)
                && !this.containsForbiddenKewyords(inp)
        },

        firstname : function (inp) {
            return this.isSet(inp)
                && /^[a-zA-Z_]+$/i.test(inp)
                && !this.containsForbiddenKewyords(inp)
        },

        lastname : function (inp) {
            return this.firstname(inp)
        },

        password : function (inp) {
            return this.minLength(4, inp)
                && this.isSet(inp)
        }

}

 
 module.exports = validators ;