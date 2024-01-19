import {pgTable, serial, uniqueIndex, varchar} from 'drizzle-orm/pg-core';

export const rooms = pgTable('room', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  password: varchar('password', { length: 256 }),
}, (rooms) => {
  return {
    nameIndex: uniqueIndex('name_idx').on(rooms.name),
  }
});