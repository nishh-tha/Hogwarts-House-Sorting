// seed.js — Run this ONCE to set up houses and traits in Neo4j
// Usage: node seed.js

require('dotenv').config();
const { driver, verifyConnection } = require('./config/db');

const houses = [
  {
    name: 'Gryffindor',
    traits: ['Bravery', 'Courage', 'Determination'],
    founder: 'Godric Gryffindor',
    animal: 'Lion',
    element: 'Fire'
  },
  {
    name: 'Slytherin',
    traits: ['Ambition', 'Cunning', 'Leadership'],
    founder: 'Salazar Slytherin',
    animal: 'Serpent',
    element: 'Water'
  },
  {
    name: 'Ravenclaw',
    traits: ['Wisdom', 'Intelligence', 'Creativity'],
    founder: 'Rowena Ravenclaw',
    animal: 'Eagle',
    element: 'Air'
  },
  {
    name: 'Hufflepuff',
    traits: ['Loyalty', 'Kindness', 'Hard Work'],
    founder: 'Helga Hufflepuff',
    animal: 'Badger',
    element: 'Earth'
  }
];

async function seed() {
  await verifyConnection();
  const session = driver.session();

  try {
    console.log('🌱 Seeding Neo4j database...\n');

    // Clear existing house/trait data (keeps students)
    await session.run(`
      MATCH (h:House) DETACH DELETE h
    `);
    await session.run(`
      MATCH (t:Trait) DETACH DELETE t
    `);
    console.log('🗑️  Cleared old House and Trait nodes');

    // Create each house and its traits
    for (const house of houses) {
      // Create the House node
      await session.run(`
        CREATE (h:House {
          name: $name,
          founder: $founder,
          animal: $animal,
          element: $element
        })
      `, {
        name: house.name,
        founder: house.founder,
        animal: house.animal,
        element: house.element
      });

      // Create each Trait node and connect it to the house
      for (const traitName of house.traits) {
        await session.run(`
          MERGE (t:Trait { name: $traitName })
          WITH t
          MATCH (h:House { name: $houseName })
          CREATE (h)-[:HAS_TRAIT]->(t)
        `, {
          traitName,
          houseName: house.name
        });
      }

      console.log(`🏰 Created house: ${house.name} with traits: ${house.traits.join(', ')}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('You can now start the server with: node server.js');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
