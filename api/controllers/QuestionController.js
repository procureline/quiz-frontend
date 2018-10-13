module.exports = {
    //
    // ────────────────────────────────────────────────────────────── I ──────────
    //   :::::: A D D  Q U E S T I O N : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────
    //
    async addQuestion(req,res){
        let request_data=req.body;
        let setfilename=`${Date.now()}.png`
        let param=JSON.parse(request_data.param)
        let obj={
            question:param.question,
            answer:param.answer,
            code:param.code,
            skill: param.skill,
            correct_answer:param.correct_answer,
            image:setfilename,
            level:param.level
        }
        await Question.create(obj)
        .then(function (result){
            if(param.image_available){
                uploadfile.moveupload(req,setfilename).then(function(data){
                    return ResponseService.json(200, res, "File uploaded Successful", data)
                }) 
            }else{
                return ResponseService.json(500, res, "Server Error", err);
            }
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    //
    // ────────────────────────────────────────────────────────────── I ──────────
    //   :::::: G E T  Q U E S T I O N : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────
    //
    async getQuestion(req,res){
        let request_data=req.query;
        let obj={
            skill: request_data.skill,
        }
        await Question.find(obj)
        .then(function (result){
            let ques=[]
            async.each(result,function(item,cb){
                let object=Object.assign({});
                object.answer=item.answer;
                object.code=item.code;
                object.createdAt=item.createdAt;
                object.id=item.id;   
                object.image=(item.image!='')?`${sails.config.custom.imageUrl}/images/${item.image}`:null;
                object.question=item.question;
                object.skill=item.skill;
                object.updatedAt=item.updatedAt;
                object.correct_answer=item.correct_answer;
                object.status=item.status;
                ques.push(object);
                cb();
            },function(){
                return ResponseService.json(200, res, "Record fetch Successful",ques);
            })
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    //
    // ────────────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: G E T   Q U I Z   Q U E S T I O N : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────────────
    //
    async getQuizQuestion(req,res){
        let request_data=req.query;
        let level=[
            {
                level:'easy',
                limtcall:request_data.easy
            },
            {
                level:'medium',
                limtcall:request_data.medium
            },
            {
                level:'difficulty',
                limtcall:request_data.difficulty
            }
        ]
        console.log('tag', level,'level');
        let question=  new Promise(function(resolve,reject){
            let ques=[] 
            async.each(level , async function(item,cb){
                let val={};
                     let obj={
                        where:{ skill: request_data.skill,level:item.level,status:1},
                        select:['answer','status','code','createdAt','id','image','question','skill','updatedAt']
                    }
                    await Question.find(obj)
                    .limit(item.limtcall)
                    .then(function (result){

                        val[item.level]=result;
                            ques.push(val);
                            
                            
                        cb();
                    })
               
            },function(){
                resolve(ques);
            })
        })
        question.then(function(data){
            return ResponseService.json(200, res, "fetch Successful", data)
        })
         
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    //
    // ──────────────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: G E T   Q U E S T I O N   B Y   I D : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────────────────────
    //
    async getQuestionById(req,res){
        let request_data=req.query;
        let obj={
            id: request_data.id,
        }
        await Question.findOne(obj)
        .then(function (result){
            if(result.image!=''){
                let image=`${sails.config.custom.imageUrl}/images/${result.image}`
            }else{
                let image=null
            }
            result.image=image
            return ResponseService.json(200, res, "Record fetch Successful", result)
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    //
    // ──────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: U P D A T E Q U E S T I O N : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────────────
    //
    async updateQuestion(req,res){
        let request_data=req.body;
        let setfilename=`${Date.now()}.png`
        let param=JSON.parse(request_data.param)
        let obj={
            question:param.question,
            answer:param.answer,
            code:param.code,
            skill: param.skill,
            correct_answer:param.correct_answer,
            image:setfilename,
            level:param.level
        }
        await  Question.update({   
            id: param.id,
        }).set(obj)
        .then(function (result){
            if(param.image_available){
                uploadfile.moveupload(req,setfilename).then(function(data){
                    return ResponseService.json(200, res, "update Successful", result)
                }) 
            }else{
                return ResponseService.json(200, res, "update Successful", result)
            }
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    //
    // ──────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: D E L E T E  Q U E S T I O N : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────────────
    //
    async deleteQuestion(req,res){
        let request_data=req.body;
        await Question.destroy({   
            id: request_data.id,
        }) 
        .then(function (result){
            return ResponseService.json(200, res, "fetch Successful", result)
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },


    //
    // ────────────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: D E A C T I V E   Q U E S T I O N : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────────────
    //
    async deactiveQuestion(req,res){
        let request_data=req.body;
         let obj={
            status:request_data.status,
    
        }
        await  Question.update({   
            id: request_data.id,
        }).set(obj)
        .then(function (result){
            return ResponseService.json(200, res, "update Successful", result)
        })
        .catch(function(err){
            return ResponseService.json(500, res, "Server Error", err);
        });
    },
    
};
