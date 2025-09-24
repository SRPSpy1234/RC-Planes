export interface Component {
    name: string;
    type: string;
    specifications: string;
}

export interface RCPlane {
    id: number;
    name: string;
    components: Component[];
}