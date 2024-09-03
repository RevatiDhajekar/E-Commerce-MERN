class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            //if keyword entered
            name:{
                $regex:this.queryStr.keyword,
                $options: "i"   //case insensitive
            }
        } :
         {};     //if no keyword present do nothing
        this.query = this.query.find({...keyword});
        return this;   //return same obj
    }

    filter(){
        const queryCopy = {...this.queryStr};

        //remove previous query fields for category filter
        const removeFields = ["keyword" , "page" , "limit"];
        removeFields.forEach((key)=> delete queryCopy[key]);
        
        //filter for price and rating
        let queryStr = JSON.stringify(queryCopy);  //obj to string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , key => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));  //find category
        return this;
    }

    pagination(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skipCount = resultsPerPage * (currentPage - 1);
        this.query = this.query.limit(resultsPerPage).skip(skipCount);
        return this;
    }
}

module.exports = ApiFeatures;