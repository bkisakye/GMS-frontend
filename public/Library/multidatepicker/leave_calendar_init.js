var today = new Date();
var y = today.getFullYear();
$('#mdp-demo').multiDatesPicker({
	addDates: ['10/14/'+y, '02/19/'+y, '01/14/'+y, '11/16/'+y],
	numberOfMonths: [3,4],
	defaultDate: '1/1/'+y
});

    // tell the embed parent frame the height of the content
    if (window.parent && window.parent.parent){
        window.parent.parent.postMessage(["resultsFrame", {
          height: document.body.getBoundingClientRect().height,
          slug: "j207ubjw"
        }], "*")
      }

      // always overwrite window.name, in case users try to set it manually
      window.name = "result"
