const config = {
  host: process.env.NODE_ENV === 'production' ? 'secret' : 'localhost',
  user: process.env.NODE_ENV === 'production' ? 'secret' : 'testuser',
  password: process.env.NODE_ENV === 'production' ? 'secret' : 'test1234',
  database: 'alexandmolly2017',
};

export default config;
