const db = require("../db/knex");
//http://localhost:7000/api/users/list?code=01
exports.list_all = async (req, res) => {
    //   async function list(req,res) {
    try {
        console.log("1].code:", req.query);
        const { code } = req.query;
        const data = await db("vocational_categories")
        console.log("2].data=>", data);
        res.json({
            message: "list Data endpoint",
            list: data,
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
};
exports.get = async (req, res) => {
    try {
        console.log("1].code:", req.query);
        const { code } = req.query;
        const data = await db("vocational_categories")
        console.log("2].data=>", data);
        res.json({
            message: "list Data endpoint",
            list: data,
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
};

// //SELECT u.name_th AS users ,d.name_th AS departments FROM users u, departments d WHERE u.department_id = d.id;
// app.get("/api/users-dep", async (req, res) => {
//   // const data =await db.raw('SELECT u.name_th AS users ,d.name_th AS departments FROM users u, departments d WHERE u.department_id = d.id');
//   const data = await db("users as u")
//     .join("departments as d", "u.department_id", "d.id")
//     .select("u.name_th as users", "d.name_th as departments");
//   console.log("Users-Departments Data:", data[0]);
//   res.send({
//     status: "Users-Departments endpoint",
//     data: data,
//   });
// });
// app.get("/api/users-dep-org", async (req, res) => {
//   const data = await db("users as u")
//     .select(
//       "u.name_th",
//       "u.role",
//       "d.name_th as department_name",
//       "o.name_th as org_group_name"
//     )
//     .innerJoin("departments as d", "u.department_id", "d.id")
//     .innerJoin("org_groups as o", "u.org_group_id", "o.id")
//     .where("u.role", "evaluatee");
//   console.log("Users-Departments-OrgGroups Data:", data);
//   res.send({
//     status: "Users-Departments-OrgGroups endpoint",
//     data: data,
//   });
// });
// //. SELECT * FROM `users` WHERE `role`= 'evaluatee';
// app.get("/api/evaluatee-users", async (req, res) => {
//   const data = await db("users").where({ role: "evaluatee" });
//   console.log("Evaluatee Users Data:", data);
//   res.send({
//     status: "Evaluatee Users endpoint",
//     data: data,
//   });
// });
// // http://localhost:7000/api/create
exports.createCategory = async (req, res) => {
    console.log("Request Body:", req.body);
    const {
        code,
        name_th,
    } = req.body;
    console.log("Create Data:", req.body);
    try {
        const [data] = await db("vocational_categories").insert({
            code,
            name_th,
        });
        console.log("Inserted Data ID:", data);
        res.send({
            status: "Create endpoint",
            id: data,
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
};
// app.put("/api/update/:id", async (req, res) => {
//   console.log(req.params.id);
//   //UPDATE `users` SET `email` = 'oak44@it.com', `name_th` = 'alonkorn2', `role` = 'admin' WHERE `users`.`id` = 10;
//   try {
//     // const {email, name_th, role,status} = req.body;
//     const data = req.body;
//     console.log("Update Data:", data);
//     const id = req.params.id;
//     const updateData = await db("users").where({ id: id }).update({
//       email: data.email,
//       name_th: data.name_th,
//       role: data.role,
//       status: data.status,
//     });
//     console.log("Updated Data Result:", updateData);
//     res.status(200).json({
//       status: "Update endpoint",
//       id: req.params.id,
//       data: updateData,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Error",
//       message: error.message,
//     });
//   }
// });
exports.catdelete = async (req, res) => {
    try {
        console.log(req.params.id);
        //DELETE FROM `users` WHERE `users`.`id` = 11;
        const id = req.params.id;
        const deleteData = await db("vocational_categories").where({ id: id }).del();
        console.log("Deleted Data Result:", deleteData);
        res.status(200).json({
            status: "Delete endpoint",
            id: req.params.id,
            data: deleteData,
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const {
            id,
            code,
            name_th,
        } = req.body;
        console.log("ตรวจสอบข้อมูล:", req.body);
        const updateData = await db("vocational_categories").where({ id: id }).update({code:code,name_th:name_th});
         console.log("ผลของการแก้ไข:", updateData);
        res.status(200).json({
            status: "แก้ไขสำเร็จ",
            id: req.body.id,
            data: updateData,
        });
    } catch (error){
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
}
