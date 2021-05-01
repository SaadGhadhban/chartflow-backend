const mongoose = require('mongoose');

const ChartSchema = new mongoose.Schema({
    data: {
        title: String,
        labels: Array,
        datasets:Array,
    },
    private:Boolean,
    description:String,
    chartType:Array,
    user: {type: mongoose.Schema.Types.ObjectId , ref:'User'}
    
})


const Chart = mongoose.model('Chart',ChartSchema);

module.exports = Chart;