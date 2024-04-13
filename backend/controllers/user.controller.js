import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ENCRYPTION_KEY_HEX = "1a42ec4506f00523a7887e596fb5ec03026e05bf22c6d4cf4760d53f91c5b3bb"; // Securely generated 32-byte key represented as 64 hex characters
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex'); // Securely generate a random key
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(Buffer.from(text, 'utf8'));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts[0], 'hex');
    let encryptedText = Buffer.from(textParts[1], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}





export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Internal server Error',
    });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, accessKeyId, secretAccessKey } = req.body;

  // Check if user already exists
  const check = await User.findOne({ email: email });
  
  if (check) {
      return res.status(409).json({ message: "User already exists" });
  }

  try {
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Encrypt AWS Keys
      const encryptedAccessKeyId = encrypt(accessKeyId);
      const encryptedSecretAccessKey = encrypt(secretAccessKey);

      // Create new user with encrypted keys
      const newUser = new User({
          name: name.trim(),
          email: email.trim(),
          password: hashedPassword,
          accessKeyId: encryptedAccessKeyId,
          secretAccessKey: encryptedSecretAccessKey
      });

      // Save the new user
      const savedUser = await newUser.save();
      res.status(201).json({ message: "User registered successfully", userId: savedUser._id });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Network error" });
  }
};


export const loginUser = async (req, res) => { 

  const { email, password } = req.body;

  console.log(email, password )

  try {
    const user = await User.findOne({ email: email.trim() });

     console.log(user);



    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessKeyId = decrypt(user.accessKeyId);
    const secretAccessKey = decrypt(user.secretAccessKey);
    console.log(accessKeyId, secretAccessKey );

    
    const keysData = {
      accessKeyId,
      secretAccessKey
    };

    const keysFilePath = path.join(__dirname, '../config/config.js');
  
    // Read the current content of the config.js file
  fs.readFile(keysFilePath, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }
    // Use regular expressions to replace old keys with new values
    let result = data.replace(/accessKeyId: "[^"]*"/, `accessKeyId: "${keysData.accessKeyId}"`);
    result = result.replace(/secretAccessKey: "[^"]*"/, `secretAccessKey: "${keysData.secretAccessKey}"`);

    // Write the new config.js content back to the file
    fs.writeFile(keysFilePath, result, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log('The keys have been updated in config.js!');
    });
});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, "fuybiug890", { expiresIn: '1h' });

    res.status(200).json({
      message: "Logged in successfully",
      token,
      userId: user._id,
      // Include any other details as needed but avoid sensitive information unless necessary
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
