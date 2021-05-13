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

const ilSınır=(req, res)=>{
    var il_kodlari = req.body.il_kodlari
    console.log(il_kodlari)
    const q_get_geo_prop = `SELECT jsonb_build_object('type', 'FeatureCollection', 'features', jsonb_agg(features.feature))FROM (SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_TRANSFORM(geom,4326))::jsonb,'properties', to_jsonb(inputs) - 'geom' - 'gid' - 'adm0_tr' - 'adm1_en' )AS feature FROM (select * from il_sinir 
        WHERE plaka= '${il_kodlari[0]}' OR plaka='${il_kodlari[1]}' OR plaka='${il_kodlari[2]}' OR plaka='${il_kodlari[3]}' OR plaka='${il_kodlari[4]}' OR plaka='${il_kodlari[5]}'
        OR plaka='${il_kodlari[6]}' OR plaka='${il_kodlari[7]}' OR plaka='${il_kodlari[8]}')inputs)features;`
    
    const q_get_geo_prop2= `SELECT jsonb_build_object('type', 'FeatureCollection', 'features', jsonb_agg(features.feature))
    FROM (SELECT jsonb_build_object('type','Feature','geometry',ST_AsGeoJSON(ST_TRANSFORM(geom,4326))::jsonb,'properties', to_jsonb(inputs) - 'geom' - 'gid' - 'adm0_tr' - 'adm1_en')
    AS feature FROM 
    (SELECT il.adm1_tr, ofis.numarataj, ofis.geometri, ofis.toplam_is toplam_ofis, il.geom, saha.hamveri, saha.supurme, saha.toplam_is toplam_saha FROM is_plani_ofis ofis 
    INNER JOIN is_plani_saha saha ON saha.il_kodu = ofis.il_kodu INNER JOIN il_sinir il ON ofis.il_kodu = il.plaka 
    WHERE plaka= '${il_kodlari[0]}' OR plaka='${il_kodlari[1]}' OR plaka='${il_kodlari[2]}' OR plaka='${il_kodlari[3]}' OR plaka='${il_kodlari[4]}' OR plaka='${il_kodlari[5]}'
        OR plaka='${il_kodlari[6]}' OR plaka='${il_kodlari[7]}' OR plaka='${il_kodlari[8]}')inputs)features;`

    pool.query(q_get_geo_prop2 , (error,results)=>{
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
                result:results.rows[0].jsonb_build_object
            })
        }
    })

}

module.exports={
ilSınır
}