let util = {
    getTimeAsJSON(optionalEpoch){
        let myDate = new Date;
        let javascriptsucksbigtime = 'x' + optionalEpoch; //Workaround because javascript
        if(javascriptsucksbigtime === 'xundefined'){
            myDate = new Date;
        }else{
            myDate.setTime(optionalEpoch);
        };
        let timeObject = internal.formatAsJSON(myDate);
        return timeObject;
    },

    getCurrentTimeAsEpoch(){
        let myDate = new Date;
        return myDate.getTime() + myDate.getTimezoneOffset();
    },
}

let internal = { 
    
    formatAsJSON(aDate){
        let myDate = new Date;
        myDate=aDate;
        let numDay = this.toFixed(myDate.getDate());
        let numMonth = this.toFixed(myDate.getMonth()+1); //Months index at zero!
        let numHours = this.toFixed(myDate.getHours());
        let numMinutes = this.toFixed(myDate.getMinutes()+1); //Minutes index at zero too!

        let timeObject = {
            epoch: myDate.getTime() + myDate.getTimezoneOffset(),
            ISO: myDate.toISOString(),
            date: numDay + '-' + numMonth + '-' + myDate.getFullYear(),
            time: numHours + ':' + numMinutes
        };
        return timeObject;
    },

    toFixed(input){//Hack because .toFixed(2) doesn't work
        let strInput = '' + input; //Hack to make sure it's treated as a string
        if(strInput.length < 2){
            strInput = ('0' + strInput);
        }else{
            strInput = (strInput);
        };
        return strInput;
    }
}

module.exports = util;