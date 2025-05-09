import { toast } from "sonner";
import { useState, useEffect } from "react";
import {JwtPayload, jwtDecode} from "jwt-decode";
import { createViewerToken } from "@/server-actions/token";

export function useViewerToken(hostIdentity: string) {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const createToken = async () => {
            try {
                const viewerToken = await createViewerToken(hostIdentity);
                setToken(viewerToken);

                const decodeToken = jwtDecode<JwtPayload>(viewerToken) as JwtPayload & {
                    name?: string;
                    identity?: string;
                };
                const name = decodeToken?.name;
                const identity =  decodeToken.sub || decodeToken.jti;
                console.log("Extracted identity:", identity);

                if (identity) {
                    setIdentity(identity);
                }
                if (name) {
                    setName(name);
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        };
        createToken();
    }, [hostIdentity]);

    return {
        token,
        name,
        identity
    };
}