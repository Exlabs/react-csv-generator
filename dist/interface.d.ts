import * as React from "react";
declare type TCsvGenerator = RequireOnlyOne<ICsvGeneratorAllProps, 'baseEndpoint' | 'items'>;
interface ICsvGeneratorAllProps {
    children: React.ReactNode;
    fileName: string;
    className?: string;
    baseEndpoint?: string | false;
    endpointDetails?: {
        [key: string]: string | number;
    };
    labels?: {
        [key: string]: string;
    };
    objectNameInResponse?: string;
    items?: {}[];
    loader?: React.ReactNode;
    errorMessage?: string;
    noDataMessage?: string;
}
export interface IEndpointDataObject {
    [key: string]: number | string | IEndpointDataObject | null;
}
export interface IParams {
    [name: string]: string | number;
}
export declare type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
}[Keys];
export declare type Any = any;
export default TCsvGenerator;
