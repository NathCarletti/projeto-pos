var database = firebase.database()

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Caminha", "OssoP", "OssoD", "Ração-G", "Ração-P"],
        datasets: [{
            label: 'Produtos Vendidos em 2016',
            data: [120, 80, 190, 50, 170],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
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
createGraphic()
var productsGraphic = new Array()
var productsGraphicN = new Array()

function createGraphic() {
    database.ref('products/')
        .once('value').then(function (snapshot) {
            //emails.push(snapshot.val()[10].email)
            for (var i = 0; i < snapshot.numChildren(); i++) {
                productsGraphic.push((500 - snapshot.val()[i].amount))
                productsGraphicN.push(snapshot.val()[i].name)
                console.log(productsGraphic) //TODO password
                console.log(productsGraphicN[i])
            }
            var ctx = document.getElementById("myChart2");
            var myChart2 = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [productsGraphicN[0], productsGraphicN[1], productsGraphicN[2], productsGraphicN[3], productsGraphicN[4]],
                    datasets: [{
                        label: 'Produtos Vendidos em 2017',
                        data: [productsGraphic[0], productsGraphic[1], productsGraphic[2], productsGraphic[3], productsGraphic[4]],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
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

        });
}
