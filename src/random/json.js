const { faker } = require('@faker-js/faker');

const generateUser = () => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  address: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode()
  },
  company: {
    name: faker.company.name(),
    catchPhrase: faker.company.catchPhrase()
  },
  createdAt: faker.date.past()
});

const CACHED_USERS_COUNT = 250;
// Remove the trailing comma when caching users
const cachedUsers = Array.from({ length: CACHED_USERS_COUNT }, generateUser)
  .map(user => JSON.stringify(user)); // Remove trailing comma here

// Precalculate the size of one user for better size estimation
const AVERAGE_USER_SIZE = Buffer.byteLength(cachedUsers[0]);

const sizeUnits = {
  mb: 1024 * 1024,
  kb: 1024
};

const generateRandomJson = async (req, res) => {
  const sizeParam = req.query.size?.toLowerCase() || '1mb';
  const unit = sizeParam.replace(/[0-9.]/g, '');
  const size = parseFloat(sizeParam);

  if (!sizeUnits[unit]) {
    return res.status(400).json({ 
      error: 'Invalid size unit. Supported units are: mb, kb' 
    });
  }

  if (isNaN(size) || size <= 0) {
    return res.status(400).json({ 
      error: 'Size must be a positive number' 
    });
  }

  const targetSize = size * sizeUnits[unit];
  
  // Add size limit check (100MB)
  const maxSize = 100 * sizeUnits.mb;
  if (targetSize > maxSize) {
    return res.status(400).json({
      error: 'Requested size exceeds maximum limit of 100MB'
    });
  }

  // Estimate number of users needed based on average size
  const estimatedUsersNeeded = Math.ceil(targetSize / AVERAGE_USER_SIZE);
  
  // Stream the response instead of building entire string in memory
  res.setHeader('Content-Type', 'application/json');
  res.write('{"users":[');

  let currentSize = 8; // Size of '{"users":[]}'
  let userIndex = 0;

  // Write users in chunks for better memory usage
  while (currentSize < targetSize) {
    const user = cachedUsers[userIndex % CACHED_USERS_COUNT]
      .replace(/"id":"[^"]+"/g, `"id":"${faker.string.uuid()}"`);
    
    // Add comma for all items except the first one
    if (userIndex > 0) {
      res.write(',');
    }
    res.write(user);
    
    currentSize += Buffer.byteLength(user) + (userIndex > 0 ? 1 : 0); // Add 1 for comma
    userIndex++;

    // Optional: Add a small delay every 1000 users to prevent event loop blocking
    if (userIndex % 1000 === 0) {
      await new Promise(resolve => setImmediate(resolve));
    }
  }

  res.write(']}');
  res.end();
};

module.exports = generateRandomJson;
