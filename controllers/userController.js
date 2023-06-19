const { User } = require('../models');
const { signToken } = require('../utils/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

module.exports = {
	async createUser({ body }, res) {
		try{
			const user = await User.create(body);
		if (!user) {
			return res.status(400).json({ message: 'Wrong credentials!' });
		}
		const token = signToken(user);
		res.json({ token, user });
		}
		catch(e){
			console.log(e)
		}
	},
	//post request
	async login(req, res){
		const { username, password } = req.body;

		try {
			const user = await User.findOne({ username });
			console.log(user)
			if (!user) {
			return res.status(401).json({ message: 'Invalid username or password' });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid username or password' });
			}

			// Generate a JSON Web Token (JWT) with a 2-hour expiration time
			const token = signToken(user);
			console.log(token)

			res.json({ message: 'Login successful', token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'An error occurred' });
		}
	},
	//post request
	async signUp(req, res){
		const { username, password, email } = req.body;
		
		try {
			
			const userData = await User.create({
				username,
				password,
				email
			});
			if (!userData) {
				// If user data is not returned, handle it as an error
				return res.status(400).json({ message: 'no user data' });
			  }
			//console.log(userData)
			const token = await signToken(userData)
			res.status(200).json({ message: 'Login successful', token });
		} catch (err) {
			console.error('Error creating user:', err);
			res.status(500).json({ message: 'Internal server error' });
		}
	},
	async getAllUsers(req, res) {
		try {
		  // Using model in route to find all documents that are instances of that model
		  const result = await User.find({});
		  res.status(200).json(result);
		} catch (err) {
		  console.log('Uh Oh, something went wrong');
		  res.status(500).json({ message: 'something went wrong' });
		}
	  },
	async getUserById(req, res) {
		try{
			const user = await User.findById(req.body.id)
			console.log(user.id)
			res.json(user)
		}catch(error){
			console.log(error)
		}
	}
}