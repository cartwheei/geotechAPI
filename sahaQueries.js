const bodyParser = require('body-parser');
const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'geotech',
    // password: process.env.DB_PASS,
    password:'e83xsf09',
    port: 5432,
  })

const q_saha_is_plani="SELECT jsonb_build_object('type', 'FeatureCollection', 'features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','properties', to_jsonb(inputs))AS feature FROM (SELECT * FROM is_plani_saha )inputs)features;"

const getSahaIsPlani = (req,res)=>{
    pool.query(q_saha_is_plani,(error,results)  =>{
            if(error){
                throw error
            }
        res.send({
            status:true,
            result:results.rows[0].jsonb_build_object
        })
    })
}


const delFromSaha = (req,res)=>{
    var il_kodu=req.body.il_kodu
    const q_del_data_saha = `DELETE FROM is_plani_saha WHERE il_kodu='${il_kodu}'`

    pool.query(q_del_data_saha,(error, results)=>{
        if(error){
            res.status(400).send({
                status:false,
                results:{'aciklama':error.detail,
                'tablo_adi':error.table,
            'message':error.severity}
            })
        }else{
            res.status(200).send({
                status:true,
                result:results
            })
        }
    })
}

const insertSaha = (req,res)=>{
    var [il_kodu,hamveri,supurme,toplam_is,personel_sayı ] = [req.body.il_kodu,
        req.body.hamveri,
        req.body.supurme,
        req.body.toplam_is,
        req.body.personel_sayı]


    var q_send_data_saha =`INSERT INTO is_plani_saha(il_kodu, hamveri, supurme, toplam_is, personel_sayı) values ('${il_kodu}', '${hamveri}', '${supurme}', '${toplam_is}','${personel_sayı}')`
    pool.query(q_send_data_saha,(error,results)=>{
        if(error){
            res.status(400).send({
                status:false,
                results:{'aciklama':error.detail,
            'tablo_adi':error.table,
            'message':error.severity}
            })
        }else{
            res.status(200).send({
                status:true,
                result:results
            })
        }
    })
    
}


module.exports={
    getSahaIsPlani,
    insertSaha,
    delFromSaha
}