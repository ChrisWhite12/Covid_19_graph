class State{
    constructor(state,color){
        this.state = state;
        this.cumul = [];
        this.daily = [];
        this.logval = [];
        this.color = color;
    }

    cal_values() {

        if (this.cumul[0] === undefined) {
            this.cumul[0] = 0;
        }
        
        for (let index = 0; index < this.cumul.length; index++) {
            if(this.cumul[index] === undefined){                        //if undefined, the current point equal the last one
                this.cumul[index] = this.cumul[index-1];
            }
        }

        var cumul_temp = 0;

        this.cumul.forEach((el,ind) => {
            if(el != undefined && (el - cumul_temp) >= 0){
                this.daily[ind] = el - cumul_temp;
                cumul_temp = el; 
            }
            else{
                this.daily[ind] = 0
            }

        })

        for (let index = 0; index < this.cumul.length; index++) {
            this.logval.push({ x: this.cumul[index], y: this.daily[index]});
        }

    }
    render_linear(){
        var data = [];
        data = [{                                            //do for each selected state
            label: `${this.state} - Cumulative`,
            borderColor: this.color,
            pointBorderColor: 'rgba(0,0,0,0)',
            pointBackgroundColor: 'rgba(0,0,0,0)',
            data: this.cumul,
            fill: false,
            yAxisID: 'y'
        },
        {
            label: `${this.state} - Daily`,
            backgroundColor: `${this.color}55`,
            pointBorderColor: 'rgba(0,0,0,0)',
            pointBackgroundColor: 'rgba(0,0,0,0)',
            data: this.daily,
            fill: true,
            yAxisID: 'y1'
        }]
        //for each state |el|
        //data.push(el.data)
        return data;
    }
    render_log(){
        var data = []
        
        data = [                                             //do for each selected state
        {
            label: `${this.state} - Cumulative vs. Daily`,
            borderColor: this.color,
            data: this.logval,
        }
        ]
        return data;
    }
}

var QLD = new State('QLD','#b30000')
var NSW = new State('NSW','#000099')
var VIC = new State('VIC','#008000')
var SA = new State('SA','#111111')
var WA = new State('WA','#808000')
var ACT = new State('ACT','#660080')
var NT = new State('NT','#ff6000')
var TAS = new State('TAS','#663300')

var state_index2 = 0;

var all_states = [QLD, NSW, VIC, SA, WA, ACT, NT, TAS];

var start_date = new Date(2020,0,25)
var now_date = Date.now();
var date_arr = [];

//calculate number of days passed
var days_elapsed = Math.floor(now_date - start_date)/(1000*60*60*24)
// console.log(days_elapsed)
var zero_date = '';
var zero_month = '';

var check_all = document.querySelectorAll(".state_check");
console.log(check_all)
var state_sel = []

var linear_scales = {y: {
                        display: true,
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            labelString: 'Cumulative Cases'
                        }
                    },
                    y1:{
                        display: true,
                        position: 'right',
                        scaleLabel: {
                            display: true,
                            labelString: 'Daily Cases'
                        }
                    }}


var log_scales = {
                    y:{
                        display: true,
                        type: 'logarithmic',
                        scaleLabel: {
                            display: true,
                            labelString: 'Daily Cases'
                        }
                    },
                    x:{
                        display: true,
                        type: 'logarithmic',
                        scaleLabel: {
                            display: true,
                            labelString: 'Cumulative Cases'
                        }
                    }
                }



//create date string from first case to current day
for (let index = 0; index < days_elapsed; index++) {
    zero_date = (start_date.getDate() < 10) ? ('0'): ('');
    zero_month = (start_date.getMonth() < 10) ? ('0'): ('');
    //convert 1 to 01
    date_arr[index] = `${zero_date + start_date.getDate().toString()}/${zero_month}${(start_date.getMonth() + 1).toString()}/${start_date.getFullYear().toString()}`;
    start_date.setDate(start_date.getDate()+1)
}
// console.log(date_arr)

function get_states_data(graph) {
    data_out = []
    state_sel = []
    check_all.forEach(el => {                       //get checked states
        if (el.checked == true){
            state_sel.push(el.dataset.num)
            console.log(`S - ${state_sel}`)
        };
    })
    if(graph == 'linear_graph'){
        state_sel.forEach(element => {
            all_states[element].render_linear().forEach( el => {
                data_out.push(el)
            })
        })
    }
    else if(graph == 'log_graph'){
        state_sel.forEach(element => {
            all_states[element].render_log().forEach( el => {
                data_out.push(el)
            })
        })
    }

    console.log(data_out)
    return data_out;
}



var config = {
    type: 'line',
    data: {
        labels: date_arr,
        datasets: get_states_data('linear_graph')
    },
    options: {
        responsive: true,
        scales: linear_scales,
        animation:{
            duration: 200
        }
        
    }
}



//retrive the json file
let requestURL = "https://interactive.guim.co.uk/docsdata/1q5gdePANXci8enuiS4oHUJxcxC13d6bjMRSicakychE.json"
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
    const data1 = request.response;
    const upd = data1.sheets.updates;
    
    upd.forEach(upd_el => {
        date_arr.forEach((date_el , date_i) => {
            for (let state_index = 0; state_index < all_states.length; state_index++) {         //for all states
                if( upd_el.State == all_states[state_index].state){                             //match states
                    if(upd_el.Date == date_el){                                                 //when date matches
                        if(upd_el["Cumulative case count"] != ''){ //check if not nil and > 0
                            all_states[state_index].cumul[date_i] = (Number(upd_el["Cumulative case count"]))
                        }
                    }           
                }      
            }
        })
    });

    all_states.forEach(el => {el.cal_values();})                    //calculate the cumulative values

var ctx = document.getElementById('Chart');


request.myChart = new Chart(ctx, config);

}

document.getElementById('graph_sel').addEventListener('change', function() {
    var el = document.getElementById('graph_sel');
    if(el.value == 'log_graph'){
        // console.log('log')
        config.type = 'scatter';
        console.log(state_index2);
        config.data.datasets = get_states_data(el.value)

        config.options.scales = log_scales;
    }
    else if(el.value == 'linear_graph'){
        // console.log('linear')
        config.type = 'line';
        console.log(state_index2);
        config.data.datasets = get_states_data(el.value)

        config.options.scales = linear_scales;
    }
    request.myChart.update();
});

check_all.forEach(el => {
    el.addEventListener('change', function() {
        if (el.checked == true){
            state_sel.push(el.dataset.num)
            console.log(`S - ${state_sel}`)
        }

        var el2 = document.getElementById('graph_sel');
        state_index2 = el.dataset.num;
        if(el2.value == 'log_graph'){
            console.log('log')
            config.type = 'scatter';
            console.log(state_index2);
            config.data.datasets = get_states_data(el2.value)
            config.options.scales = log_scales;
        }
        else if(el2.value == 'linear_graph'){
            console.log('linear')
            config.type = 'line';
            console.log(state_index2);
            config.data.datasets = get_states_data(el2.value)
            config.options.scales = linear_scales;
        }
        request.myChart.update();
    })    
})



