const config = {
  host: process.env.NODE_ENV === 'development' ? 'localhost' : 'secret',
  user: process.env.NODE_ENV === 'development' ? 'testuser' : 'secret',
  password: process.env.NODE_ENV === 'development' ? 'test1234' : 'secret',
  database: 'alexandmolly2017',
};

export default config;
