import { describe, it, expect } from 'vitest'
import type { NodeCategory, NodeTypeConfig } from '@/types/funnel'

describe('NodeCategory types', () => {
  it('should accept valid traffic source categories', () => {
    const validCategories: NodeCategory[] = [
      'google_ads',
      'facebook_ads',
      'instagram_ads',
      'tiktok_ads',
      'linkedin_ads',
      'youtube_ads',
      'twitter_ads',
      'pinterest_ads',
      'snapchat_ads',
      'reddit_ads',
      'affiliate',
      'organic_search',
      'direct',
      'email_marketing',
      'podcast',
      'webinar',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid page categories', () => {
    const validCategories: NodeCategory[] = [
      'landing_page',
      'sales_page',
      'checkout',
      'thank_you',
      'blog_post',
      'webinar_registration',
      'survey',
      'calendar',
      'order_page',
      'upsell',
      'vsl',
      'bridge_page',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid event categories', () => {
    const validCategories: NodeCategory[] = [
      'email',
      'sms',
      'phone_call',
      'calendar_event',
      'form_submit',
      'video_view',
      'link_click',
      'file_download',
      'add_to_cart',
      'initiate_checkout',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })

  it('should accept valid conversion categories', () => {
    const validCategories: NodeCategory[] = [
      'purchase',
      'lead',
      'signup',
      'subscription',
      'demo_request',
      'consultation',
    ]
    
    validCategories.forEach(category => {
      expect(category).toBeDefined()
    })
  })
})
