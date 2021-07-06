import React from 'react'
import {
  Card,
  Layout,
  TextContainer,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText
} from '@shopify/polaris'

const loadingPageMarkup = () => (
  <SkeletonPage>
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size='small' />
            <SkeletonBodyText lines={9} />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
)

export default loadingPageMarkup
