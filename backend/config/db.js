const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI, 
  neo4j.auth.basic(
    process.env.NEO4J_USER, 
    process.env.NEO4J_PASSWORD
  )
);

// Aura connections can sometimes time out if idle.
// The driver handles this, but verifyConnection() is a good health check.
async function verifyConnection() {
  try {
    await driver.verifyConnectivity();
    console.log('✅ Connected to Neo4j Aura successfully');
  } catch (err) {
    console.error('❌ Aura connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { driver, verifyConnection };