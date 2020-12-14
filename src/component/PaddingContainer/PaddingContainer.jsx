import styled from 'styled-components'
/**
 * Padding should be consistant
 * But we can not specify padding at a root level
 * it will cause trouble when the full width is required
 * especially when overflow present where nagative margin
 * can not work
 *
 * We should specify the paddding at a more detailed level
 */

export default styled.div`
  padding: 2rem;
  padding-bottom: ${(props) => (props.bottom ? '2rem' : '')};
`
