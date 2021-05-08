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

const q_ofis_is_plani="SELECT jsonb_build_object('type', 'FeatureCollection', 'features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','properties', to_jsonb(inputs))AS feature FROM (SELECT * FROM is_plani_ofis )inputs)features;"

const delFromOfis = (req,res)=>{
    var il_kodu=req.body.il_kodu

    const q_del_data_ofis = `DELETE FROM is_plani_ofis WHERE il_kodu='${il_kodu}'`

    pool.query(q_del_data_ofis,(error, results)=>{
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

const insertOfis = (req,res)=>{
    var [il_kodu,numarataj,geometri,toplam_is ] = [req.body.il_kodu,
        req.body.numarataj,
        req.body.geometri,
        req.body.toplam_is]

    var q_send_data_ofis =`INSERT INTO is_plani_ofis(il_kodu, numarataj, geometri, toplam_is) values ('${il_kodu}', '${numarataj}', '${geometri}', '${toplam_is}')`

    pool.query(q_send_data_ofis,(error,results)=>{
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



const getOfisIsPlani = (req,res)=>{
    pool.query(q_ofis_is_plani,(error,results)  =>{
            if(error){
                throw error
            }

        res.send({
            status:true,
            result:results.rows[0].jsonb_build_object
        })
    })
}






module.exports={
    getOfisIsPlani,
    insertOfis,
    delFromOfis
}