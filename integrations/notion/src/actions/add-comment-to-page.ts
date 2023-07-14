import * as notion from '../notion'
import type { IntegrationProps } from '.botpress'

export const addCommentToPage: IntegrationProps['actions']['addCommentToPage'] = async ({ ctx, input }) => {
  try {
    const response = await notion.addCommentToPage(ctx, input.pageId, input.commentBody)
    if (response) {
      console.info('Successfully added comment to page')
      return { success: true, response }
    } else {
      return { success: false }
    }
  } catch (error) {
    return { success: false }
  }
}