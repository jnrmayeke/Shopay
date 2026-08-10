import {inngest} from './client';

// Inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
  {id: 'sync-user-create', triggers: {event: 'clerk/user.created'}},
  async ({ event }) => {
    const {data} = event
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_adress,
        name: '${data.first_name} ${data.last_name}',
        image: data.image_url,
      }
    })
  }
)

// Inngest function to update user data to database
export const syncUserUpdation = inngest.createFunction(
  {id: 'sync-user-update', triggers: {event: 'clerk/user.updated'}},
  async ({ event }) => {
    const {data} = event
    await prisma.user.update({
      where: {id: data.id,},
      data: {
        email: data.email_addresses[0].email_adress,
        name: '${data.first_name} ${data.last_name}',
        image: data.image_url,
      }
    })
  }
)

// Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
  {id: 'sync-user-delete', triggers: {event: 'clerk/user.deleted'}},
  async ({ event }) => {
    const {data} = event
    await prisma.user.delete({
      where: {id: data.id,}
    })
  }
)