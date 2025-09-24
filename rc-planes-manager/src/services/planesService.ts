import { Plane } from '../types';

let planes: Plane[] = [];

export const getPlanes = (): Plane[] => {
    return planes;
};

export const addPlane = (newPlane: Plane): void => {
    planes.push(newPlane);
};

export const updatePlane = (updatedPlane: Plane): void => {
    const index = planes.findIndex(plane => plane.id === updatedPlane.id);
    if (index !== -1) {
        planes[index] = updatedPlane;
    }
};

export const getPlaneById = (id: string): Plane | undefined => {
    return planes.find(plane => plane.id === id);
};