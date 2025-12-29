import { db } from '~~/server/db';
import { forumCategories, forumTopics } from '~~/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Category ID is required',
    });
  }

  const category = await db.query.forumCategories.findFirst({
    where: eq(forumCategories.id, id),
    with: {
      topics: {
        orderBy: [desc(forumTopics.isPinned), desc(forumTopics.updatedAt)],
        with: {
          author: {
            columns: {
              id: true,
              username: true,
            },
          },
          posts: {
            limit: 1,
            orderBy: (posts, { desc }) => [desc(posts.createdAt)],
          },
        },
      },
    },
  });

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    });
  }

  return category;
});
