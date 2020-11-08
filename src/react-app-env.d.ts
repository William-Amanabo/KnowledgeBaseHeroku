/// <reference types="react-scripts" />


declare module '*.svg?inline'{
    const content : any
    export default content
} 

declare module '*.svg'{
    const content : any
    const ReactComponent : any
    export default content
    export const ReactComponent
} 
