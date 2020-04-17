var QLD_data = [];
var NSW_data = [];
var VIC_data = [];

//retrive the json file
let requestURL = "https://interactive.guim.co.uk/docsdata/1q5gdePANXci8enuiS4oHUJxcxC13d6bjMRSicakychE.json"
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
    const data1 = request.response;
    const upd = data1.sheets.updates;
    console.log(data1);
    console.log(upd);
    upd.forEach(el => {
        // console.log(el)
        if( el.State == "QLD"){
            QLD_data.push(el);            
        }    
        if( el.State == "NSW"){
            NSW_data.push(el);            
        }    
        if( el.State == "VIC"){
            VIC_data.push(el);            
        }    
    });

    QLD_data.forEach(el => {
        if(el["Cumulative case count"] != ''){
            //console.log(`${el["Cumulative case count"]} -- ${el.Date}`)
        }
    })
  }

//store  each state into diferent varibles


//graph the result

var ctx = document.getElementById('myChart');
console.log(ctx);

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});