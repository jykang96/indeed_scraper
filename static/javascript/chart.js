function salaryGraphAdder(salary){
    //if-immediate
    if(salary <= 15000){salaryA++}
    else if(salary <= 30000){salaryB++}
    else if(salary <= 45000){salaryC++}
    else if(salary <= 60000){salaryD++}
    else if(salary <= 75000){salaryE++}
    else if(salary <= 90000){salaryF++}
    else {salaryG++}
}
//sets of data for salary range
let salaryA = 0;
let salaryB = 0;
let salaryC = 0;
let salaryD = 0;
let salaryE = 0;
let salaryF = 0;
let salaryG = 0;
let salaryNotPosted = 0;
//sets of data for posting Dates
let dateToday = 0;
let dateA = 0;
let dateB = 0;
let dateC = 0;
let dateD = 0;
let dateE = 0;
let dateF = 0;
let dateG = 0;

var jobs = '{{data|safe}}'
jobs = JSON.parse(jobs)
for (var i = 0; i < jobs.length; i++) {
    //cases where salary is unspecified
    if(jobs[i].salary === ""){
    salaryNotPosted++
    }
    //cases where the employer posted hourly wages
    else if(jobs[i].salary.search('year') === -1 && !(jobs[i].salary.search('hour') === -1)){
    //var string = newData[i].salary.replaceAll('$','').replaceAll(',','');
    var list = jobs[i].salary.match(/\d*\.\d+|\d+/g);
    if(list.length === 2){
        list.sort((x,y)=>{
        //calculating salary; equation: average of the range * 40(hours) * 52(weeks)
        salaryGraphAdder(((x*1+y*1)/2)*40*52)
        });
    }
    else if(list.length === 1){
        salaryGraphAdder((list[0]*1)*40*52);
    }
    }
    //cases where the emoplyer posted annual income
    else if(!(jobs[i].salary.search('year') === -1) && jobs[i].salary.search('hour') === -1){
        var string = jobs[i].salary.replaceAll('$','').replaceAll(',','');
        var list = string.match(/\d+/g);
        if(list.length === 2){
            list.sort((x,y)=>{
            //calculating annual salary: by average
            salaryGraphAdder(((x*1+y*1)/2));
            });
        }
        else if(list.length === 1){
            salaryGraphAdder(list[0]);
        }
    }
    else if(jobs[i].salary.search('month' === -1)){
        var string = jobs[i].salary.replaceAll('$','').replaceAll(',','');
        var list = string.match(/\d+/g);
        if(list.length === 2){
            list.sort((x,y)=>{
            //calculating monthly salary: by average
            salaryGraphAdder(((x*1+y*1)/2)*12);
            });
        }
        else if(list.length === 1){
            salaryGraphAdder(list[0]*12);
        }
    }
}
console.log(salaryNotPosted);
//loop for posted dates
for(var i =0; i < jobs.length; i++){
let date = jobs[i].post_date.replace('days ago', '').replace('day ago', '').replace('Just posted', 'Today');
if(date ==="Today"){
dateToday++;
}
else if(date*1 <= 5){
dateA++;
}
else if(date*1 > 5 && date*1 <= 10){
dateB++;
}
else if(date*1 > 10 && date*1 <= 15){
dateC++;
}
else if(date*1 > 15 && date*1 <= 20){
dateD++;
}
else if(date*1 > 20 && date*1 <= 25){
dateE++;
}
else if(date*1 > 25 && date*1 <= 30){
dateF++;
}
else{
dateG++;
}
}

let ChartOne = document.getElementById('myChart').getContext('2d');
let ChartTwo = document.getElementById('myChartTwo').getContext('2d');
let ChartThree = document.getElementById('myChartThree').getContext('2d');
document.getElementById('nonReportedSalary').innerHTML = `Number of unspecified salary range: ${salaryNotPosted}`
document.getElementById('jobPostings').innerHTML = `Number of job postings in the past 30 days: ${jobs.length - dateG}`
document.getElementById('totalJobNumber').innerHTML = `- A total number of ${jobs.length} jobs have been found`
document.getElementById('commonSalary').innerHTML = `- The most common salary range for this job is 100`
let salaryChart = new Chart(ChartOne, {
type: 'bar', // bar, horizontalbar, pie, line, doughnut, radar, polarArea... many types of graphs
data: {
    labels: ['$0 ~ $15k', '$15k ~ $30k', '$30k ~ $45k', '$45k ~ $60k', '$60k ~ $75k', '$75k ~ $90k', '$90k ~ $100k+'],
    datasets:[{
        label: 'Companies',
        data:[
            salaryA,
            salaryB,
            salaryC,
            salaryD,
            salaryE,
            salaryF,
            salaryG
        ],
        backgroundColor: [
            '#decab0'
        ],
        borderWidth: 1.5,
        borderColor: '#777',
        hoverBorderWidth: 4,
        hoverBorderColor: '#4C516D'
    }]
},
options: {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
let postDateChart = new Chart(ChartTwo, {
type: 'line', // bar, horizontalbar, pie, line, doughnut, radar, polarArea... many types of graphs
data: {
    labels: ['Today','Past 5 days', '5 ~ 10 days ago', '10 ~ 15 days ago', '15 ~ 20 days ago', '20 ~ 25 days ago', '25 ~ 30 days ago', '30+ days ago'],
    datasets:[{
        label: 'Number of occurances',
        data:[
            dateToday,
            dateA,
            dateB,
            dateC,
            dateD,
            dateE,
            dateF,
            dateG
        ],
        backgroundColor: [
            '#decab0'
        ],
        borderWidth: 1.5,
        borderColor: '#777',
        hoverBorderWidth: 4,
        hoverBorderColor: '#4C516D'
    }]
},
options: {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true
            }
        }]
    }
}
});
//third chart
let fullPartChart = new Chart(ChartThree, {
type: 'pie', // bar, horizontalbar, pie, line, doughnut, radar, polarArea... many types of graphs
data: {
    labels: ['Part', 'Full'],
    datasets:[{
        label: 'Number of occurances',
        data:[
            1,
            2
        ],
        backgroundColor: [
            '#decab0',
            '#b0dbde'
        ],
        borderWidth: 1.5,
        borderColor: '#777',
        hoverBorderWidth: 4,
        hoverBorderColor: '#4C516D'
    }]
}
});