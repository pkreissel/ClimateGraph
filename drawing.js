var ctx = document.getElementById('canvas').getContext('2d');
var path = document.select.path
var scenario = document.select.scenario

/**
 * The function takes the values a input fields called "scenario"/"path" as default input
 * It then calculates emissions scenario-path to hit both scenario and path constraints
 *
 * @param {Number} scenario Total number of available CO2 to reach target
 * @param {Number} path Year of CO2 neutrality
 * @requires utils.js
 * @return {Array} array of yearly emissions ready for plotting from 2020 to 2100
*/
const update_data = (scenario = Number(window.scenario.value), path = Number(window.path.value)) => {
  if(path == 2100) return fillArray(40, 80)
  let data = new Array(80)
  for(var x = 0; x <= (path - 2020); x++) {
    data[x] = 40 - x/(path - 2020)*40
    scenario -= data[x]
  }
  if (scenario > 0) return data
  for(var x = (path - 2020 + 1); x <= (2100 - 2020 + 1); x++) {
    data[x] = scenario/(2100-(path+1))
  }
  return data
}

/**
 * The function takes data as input and changes the text of the #output field
 * It then calculates emissions scenario-path to hit both scenario and path constraints
 * @param {Array} data e.g. from "update_data" function
*/
const text_output = (data) => {
    let message = ""
    // TODO: Temperature calculation should be outsourced to centralized function
    let temp = 1.5 + (scenario.value-333)/666*0.5
    let outcome = Number(window.scenario.value) - Number(data.reduce((sum, x)=>{return sum + Math.abs(x)}))

    // TODO: This is very ugly code, could be outsourced to a data.js
    if(outcome > 0) message += `Dein Temperaturziel von ${temp}°C wird erreicht.<br>`
    else {
      message += `Dein Temperaturziel wird um ${-Math.round(outcome)} Gigatonnen verfehlt.`
      message += `Diese Emissionen müssen von der aktuellen Jugend für min. ${-Math.round(outcome) * 100} Mrd. € wieder aus der Athmosphäre entfernt werden.<br>`
    }
    message += "Dein Temperaturziel führt wahrscheinlich zu: <br>"
    if (temp > 2) {
      message += "- unkontrollierbaren Rückkopplungseffekten, die weitere Erderhitzung nach sich ziehen<br>"
      message += "- der Zerstörung der meisten Korallenriffe (Bye Nemo)<br>"
      message += "- einem weltweiten Massenaussterben von Tieren <br>"
      message += "- dem Untergang von Venedig <br>"

    } else if(temp == 2) {
      message += "- schlecht beherrschbarer Anstieg von Extremwetterereignissen<br>"
      message += "- es ist wahrscheinlich, dass bereits planetare Kipppunkte erreicht werden, die nicht mehr umkehrbar sind."
    } else {
      message += "- beherrschbarer Anstieg von Extremwetterereignissen<br>"
    }
    document.querySelector("#output").innerHTML = message
    return
}

/**
 * The function renders or updates the chart.
 * chart is saved in window.chart
*/
const render_graph = () => {
  if(window.chart) window.chart.destroy()
  let data = update_data()
  let sum = 0
  let targets = []
  for(var x = 0; x < data.length; x++) {
    if(sum > window.scenario.value & targets.length == 0) targets.push(x)
    sum += data[x]
  }
  text_output(data)
  window.chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: range(2020,2100),
          datasets: [{
              label: 'CO2-Emissionen pro Jahr',
              data: data,
              borderWidth: 1
          }]
      },
      lineAtIndex: targets,
      options: {
        elements: {
            line: {
                tension: 0 // disables bezier curves
            }
        },
        animation: {
            duration: 0 // general animation time
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    },
  });
}

//Render chart on DOMContentLoaded and Update chart on input
path.addEventListener("input", render_graph)
scenario.addEventListener("input", render_graph)
document.addEventListener('DOMContentLoaded', render_graph)
