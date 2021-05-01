const User = require('../models/User');
const Chart = require('../models/Chart');


const chartData = {
    labels: ['A', 'B', 'C', 'D', 'E', 'F'],
    datasets: [
        {
            label:'# of Votes',
            data:[12,8,22,29,13,22],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
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
        },
        {
            label:'# of counts',
            data:[5,42,21,20,23,30],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 0.3)',
                'rgba(153, 102, 255, 0.3)',
                'rgba(255, 159, 64, 0.3)'
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
        }
    ]
}



exports.getPrivateData = (req,res,next)=>{
    
    res.status(200).json({
        success:true,
        data: req.user,
        chartData

    })
}


exports.addChart = async(req,res,next)=>{
    const {chart} = req.body;
    const founduser = await User.findOne({_id:req.user._id})
    const newChart = new Chart(chart);
    founduser.charts.push(newChart);
    newChart.user = founduser;
    console.log(newChart);
    await newChart.save();
    await founduser.save()

    res.status(200).json({
        success:true,
        data:{chart,founduser}
    })
}

exports.privateCharts = async(req,res,next)=>{
    const usercharts = await User.findOne({_id:req.user._id}).populate('charts')
    const founduser = await User.findOne({_id:req.user._id});
    const username = founduser.username
    
    res.status(200).json({
        success:true,
        data:{usercharts,username}
    })
}