export declare const schemas: {
    dapp: {
        PrivateProfile: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                tokenId: {
                    type: string;
                    title: string;
                };
                tokenURI: {
                    type: string;
                    title: string;
                };
                encrypted: {
                    type: string;
                    title: string;
                };
            };
        };
        PublicProfile: {
            $schema: string;
            title: string;
            type: string;
            properties: {
                skillTags: {
                    title: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                experiences: {
                    title: string;
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            company: {
                                type: string;
                                maxLength: number;
                            };
                            title: {
                                type: string;
                                maxLength: number;
                            };
                            description: {
                                type: string;
                            };
                            startDate: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            endDate: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                        };
                    };
                };
                education: {
                    title: string;
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            institution: {
                                type: string;
                                maxLength: number;
                            };
                            title: {
                                type: string;
                                maxLength: number;
                            };
                            description: {
                                type: string;
                            };
                            startDate: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                            endDate: {
                                type: string;
                                format: string;
                                maxLength: number;
                            };
                        };
                    };
                };
            };
        };
    };
};
