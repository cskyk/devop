const db = require('../db/knex')
const bcrypt = require('bcrypt');
exports.list = async (req, res) => {
  // async function list(req, res) {
  console.log('code:', req.query)
  const { code } = req.query
  // let data =await db.select('*').from('users')
  // let data =await db('users')
  // let data =await db.raw('SELECT name_th FROM vocational_categories WHERE code = "CAT08";')
  //   let [data] = await db.raw("SELECT code,name_th FROM vocational_categories WHERE code = '"+code+"';")
  //   let [data] = await db.raw("SELECT code,name_th FROM vocational_categories WHERE code = ? ;", [code] )
  //   let [data] = await db.raw(`SELECT code,name_th FROM vocational_categories WHERE code = ${code}`)
  const [data] = await db('vocational_categories').select('code', 'name_th').where('code', code);
  //   where({code: code, name:.....}) และแบบเร็วๆ
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    list: data
    // data: data[0][0]
  })
}
// module.exports = {
//     list,
// }

exports.list_all = async (req, res) => {
  //   async function list(req,res) {
  // console.log("1].code:", req.query);
  // const { code } = req.query;
  const data = await db("vocational_categories")
  console.log("2].data=>", data);
  res.json({
    message: "list Data endpoint",
    list: data,
  });
};

exports.list_users_all_admin = async (req, res) => {
  try {
    const data = await db("users").select('*').where('role', "admin")
    console.log("2].data=>", data);
    res.json({
      message: "list Data endpoint",
      list: data,
    });
  } catch {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.listrole = async (req, res) => {
  console.log('role:', req.query)
  const { role } = req.query
  const data = await db('users').select('*').where('role', role);
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    list: data
  })
}

exports.createadmin = async (req, res) => {
  console.log('FROMDATA => ', req.body);
  const { email, password_hash, name_th, role = "admin", status } = req.body; //, department_id, org_group_id//คำสั่งจากตัว backend ที่รับมาจากข้อมูลมาจาก frontend
  try {
    const [data] = await db('users').insert({
      email,
      password_hash,
      name_th,
      role,
      status,
      // department_id,
      // org_group_id
    });
    console.log('Inserted Data ID:', data);
    res.send({
      status: 'Create endpoint',
      id: data
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }

}

exports.usersedit = async (req, res) => {
  try {
    const {
      id,
      email,
      name_th,
      status,
      password_hash,
    } = req.body;

    let dataToUpdate = {
        email: email,
        name_th: name_th,
        status: status
    };
    if (password_hash && password_hash.trim() !== "") {
        dataToUpdate.password_hash = password_hash; 
    }
    console.log("ตรวจสอบข้อมูล:", req.body);
    const updateData = await db("users").where({ id: id }).update(dataToUpdate);
    console.log("ผลของการแก้ไข:", updateData);
    res.json({
      status: "success",
      message: 'Update successfully',
      rowAffected: updateData
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
}

exports.list_users_all_evaluator = async (req, res) => {
  try {
    const data = await db("users").select('*').where('role', "evaluator")
    console.log("2].data=>", data);
    res.json({
      message: "list Data endpoint",
      list: data,
    });
  } catch {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createevaluator = async (req, res) => {
  console.log('FROMDATA => ', req.body);
  const { email, password_hash, name_th, role = "evaluator", status } = req.body; //, department_id, org_group_id//คำสั่งจากตัว backend ที่รับมาจากข้อมูลมาจาก frontend
  try {
    const [data] = await db('users').insert({
      email,
      password_hash,
      name_th,
      role,
      status,
      // department_id,
      // org_group_id
    });
    console.log('Inserted Data ID:', data);
    res.send({
      status: 'Create endpoint',
      id: data
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }

}

exports.list_users_all_evaluatee = async (req, res) => {
  try {
    const data = await db("users").select('*').where('role', "evaluatee")
    console.log("2].data=>", data);
    res.json({
      message: "list Data endpoint",
      list: data,
    });
  } catch {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.createevaluatee = async (req, res) => {
  console.log('FROMDATA => ', req.body);
  const { email, password_hash, name_th, role = "evaluatee", status } = req.body; //, department_id, org_group_id//คำสั่งจากตัว backend ที่รับมาจากข้อมูลมาจาก frontend
  try {
    const [data] = await db('users').insert({
      email,
      password_hash,
      name_th,
      role,
      status,
      // department_id,
      // org_group_id
    });
    console.log('Inserted Data ID:', data);
    res.send({
      status: 'Create endpoint',
      id: data
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }

}

exports.list_all_users = async (req, res) => {
  const data = await db("users")
  console.log("2].data=>", data);
  res.json({
    message: "list Data endpoint",
    list: data,
  });
};

exports.get = async (req, res) => {
  const data = await db('users').select('name_th').where('status', 'active');
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data: data
  })
}

exports.list2 = async (req, res) => {
  const data = await db('users').select('name_th').where('role', 'evaluatee');
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data: data
  })
}

exports.list3 = async (req, res) => {
  const data = await db('users as u')
    .join('departments as d', 'u.department_id', 'd.id')
    .join('org_groups as o', 'u.org_group_id', 'o.id')
    .where('u.role', 'evaluatee')
    .select('u.name_th as users'
      , 'd.name_th as departments',
      'o.name_th as org_groups',
      'u.role as role')

  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data
  })
}

//INSERT INTO `users` (`id`, `email`, `password_hash`, `name_th`, `role`, `status`, `department_id`, `org_group_id`, `created_at`, `updated_at`) VALUES (NULL, 'ex@gmail.com', '$2b$10$fxY.nEVdF5jHCZAEIsvGzOqcrZB.D69WJFP9xCzh3LaflKntx1uwa', 'ท่านร', 'evaluator', 'active', '3', '4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
exports.create = async (req, res) => {
  console.log('FROMDATA => ', req.body);
  const { email,password, name_th, role = "evaluatee", department_id, org_group_id } = req.body; //คำสั่งจากตัว backend ที่รับมาจากข้อมูลมาจาก frontend
  try {
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password,saltRounds);
    const [data] = await db('users').insert({
      email,
      password_hash,
      name_th,
      role,
      status: 'active',
      department_id,
      org_group_id
    });
    console.log('Inserted Data ID:', data);
    res.send({
      status: 'Create endpoint',
      id: data
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }

}

exports.departments_show_all = async (req, res) =>{
  try {
    const data_departments = await db('departments').select('*')
     res.send({
      status: 'data endpoint',
      data_departments: data_departments
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
}

exports.org_groups_show_all = async (req, res) =>{
  try {
    const data_org_groups = await db('org_groups').select('*')
     res.send({
      status: 'data endpoint',
      data_org_groups: data_org_groups
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
}

exports.deleteusers = async (req, res) => {
    const id = req.params.id
    try {
      const deleteData = await db('users').where('id',id).del()
      res.status(200).json({
      status: 'Delete endpoint',
      id: id
  })
    } catch {
    res.status(500).json({
    status: 'Error to delete',
    message: error.message}) 
  }
}
exports.delete1 = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCount = await db('users').where({ id: id }).del();

    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'User not found',
        id
      });
    }

    res.status(200).json({
      status: 'Delete endpoint',
      deletedId: id
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error to delete',
      message: error.message
    });
  }
}


exports.delete2 = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await db('users').where('id', id).del();
    res.status(200).json({
      status: 'Delete endpoint',
      deletedCount: id
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error to delete',
      message: error.message
    })
  }
}

exports.update = async (req, res) => {
  try {
    const { email, name_th, role, status } = req.body;
    const id = req.params.id;
    const updateData = await db('users')
      .where('id', id)
      .update({
        email: email,
        name_th: name_th,
        role: role,
        status: status
      });
    console.log('Up data Result:', updateData);
    res.status(200).json({
      status: 'Update endpoint',
      id: req.params.id,
      data: updateData
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    })
  }

}
