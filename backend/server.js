const express = require('express')
const app = express()
const db = require('./db/knex')
const port = 7000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/health', (req, res) => {
  console.log(req.query)
  res.send({
    status: 'OK',
    data: req.query
  })
})

// app.get('/api/list', (req, res) => { 
//   let data = db.select('*').from('users')
//   console.log(data)
//   res.json({ message: 'list Data endpoint',
//     data: data
//    })
//   })

app.get('/api/list', async (req, res) => {
  console.log('code:', req.query)
  const { code } = req.query
  // let data =await db.select('*').from('users')
  // let data =await db('users')
  // let data =await db.raw('SELECT name_th FROM vocational_categories WHERE code = "CAT08";')
  //   let [data] = await db.raw("SELECT code,name_th FROM vocational_categories WHERE code = '"+code+"';")
  //   let [data] = await db.raw("SELECT code,name_th FROM vocational_categories WHERE code = ? ;", [code] )
  //   let [data] = await db.raw(`SELECT code,name_th FROM vocational_categories WHERE code = ${code}`)
  const data = await db('vocational_categories').select('code', 'name_th').where('code', code);
  //   where({code: code, name:.....}) และแบบเร็วๆ
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data: data
    // data: data[0][0]
  })
})

app.get('/api/list1', async (req, res) => {
  const data = await db('users').select('name_th').where('status', 'active');
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data: data
  })
})

app.get('/api/list2', async (req, res) => {
  const data = await db('users').select('name_th').where('role', 'evaluatee');
  console.log('data => ', data)
  res.json({
    message: 'list Data endpoint',
    data: data
  })
})

app.get('/api/list3', async (req, res) => {
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
})

//INSERT INTO `users` (`id`, `email`, `password_hash`, `name_th`, `role`, `status`, `department_id`, `org_group_id`, `created_at`, `updated_at`) VALUES (NULL, 'ex@gmail.com', '$2b$10$fxY.nEVdF5jHCZAEIsvGzOqcrZB.D69WJFP9xCzh3LaflKntx1uwa', 'ท่านร', 'evaluator', 'active', '3', '4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
app.put('/api/create', async (req, res) => {
  console.log('FROMDATA => ', req.body);
  const { email, password_hash, name_th, role = "evaluatee", status, department_id, org_group_id } = req.body; //คำสั่งจากตัว backend ที่รับมาจากข้อมูลมาจาก frontend
  try {
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

})

// app.delete('/api/delete/:id', (req, res) => {
//     const {id} = req.params
//     try {
//       const {id} = db('users').where('id',id).del()
//       res.status(200).json({
//       status: 'Delete endpoint',
//       id: req.params.id
//   })
//     } catch {
//     res.status(500).json({
//     status: 'Error to delete',
//     message: error.message}) 
//   }
// })
app.delete('/api/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCount = await db('users').where({id : id}).del();

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
});


app.delete('/api/delete', async (req, res) => {
  const { id } = req.body;
  try {
    const data =  db('users').where('id', id).del();
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
});

app.put('/api/update/:id', async(req, res) => {
  try {
    const { email, name_th, role, status } = req.body;
    const id = req.params.id;
    const updateData =await db('users')
      .where('id', id )
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
  } catch {
     res.status(500).json({
      status: 'Error',
      message: error.message
  })}

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
