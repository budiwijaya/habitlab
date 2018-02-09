const {polymer_ext} = require('libs_frontend/polymer_utils')
const screenshot_utils = require('libs_common/screenshot_utils')

polymer_ext({
  is: 'market-card',
  properties: {
    name: {
      type: String
    },
    date:{
      type: String
    },
    description:{
      type: String
    },
    starCount:{
      type: Number
    }
  },
  ready: async function() {
      this.$$(".card").hover(
      function(){
  	     this.$$(".description", this).css("display", "block");
	   },function(){
  		   this.$$(".description", this).css("display", "none");
     });
    //console.log('site is:')
    //console.log(this.site)
    //console.log('ready called in intervention market. fetching data')
    //let data = await fetch('localhost:5000').then(x => x.json())
    //console.log('finished fetching data')
    //console.log(data)
  }
})
