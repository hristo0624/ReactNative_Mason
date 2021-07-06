import React from 'react'
import {
  Page,
  Layout,
  TextContainer,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText
} from '@shopify/polaris'

const LoadingPage = () => (
  <Page>
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <TextContainer>
            <SkeletonBodyText lines={9} />
          </TextContainer>
        </Layout.Section>
        <Layout.Section>
          <TextContainer>
            <SkeletonDisplayText size='small' />
            <SkeletonBodyText lines={9} />
          </TextContainer>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </Page>
)

export default LoadingPage
