let query = require("../query.js");
let formidable = require("formidable");
let trim = require("trim");
require("./Date.js");

class Index {

    static async index(req, res, next) {
        res.locals.page_title = "WallStreet";
        const sql = "select * from cate";
        let results = await query(sql);
        res.render("index", { cates: results });
    }

    //查询商品
    static async search(req, res, next) {
        let g_name;
        //搜索名
        if (req.query.g_name && trim(req.query.g_name) != "") {
            g_name = trim(req.query.g_name);
        } else {
            return res.redirect("/");
        }
        res.locals.page_title = "华尔街-搜索：" + g_name;
        //所选商品类型
        let c_id = parseInt(req.query.c_id);
        let sql = `select * from good_cate where name LIKE '%${g_name}%'`;
        if (c_id)
            sql += `and c_id=${c_id}`;
        //results是商品
        let results = await query(sql);
        for (let i in results) {
            switch (results[i].cate) {
                case "Futures": //目前只有期货数据
                    sql = "select * from futures where g_id=? order by date desc limit 1";
                    results[i].latest_data = (await query(sql, results[i].id))[0];
                    results[i].latest_data.date = new Date(results[i].latest_data.date).format("yyyy-MM-dd");
                    results[i].jump = "/futures/" + results[i].id;
                    break;
                default:
                    break;
            }
        }
        res.render("index_search", { goods: results, search: g_name });
    }
}
module.exports = Index;
