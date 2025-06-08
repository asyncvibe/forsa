const mongoose = require('mongoose');
const KeywordSchema = new mongoose.Schema({
name:{
    type: String
},
count:{
type: Number,
default: 0
}
},
{
    timestamps: true
});

const Keyword = mongoose.model('Keyword', KeywordSchema);
module.exports = Keyword;