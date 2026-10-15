import assert from "node:assert/strict";
import test from "node:test";
import "reflect-metadata";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

import { AppError } from "../src/Application/Errors/AppError";
import type { IJwtService } from "../src/Application/Interfaces/Services/IJwtService";
import { errorHandler } from "../src/InterfaceAdapters/Middleware/errorHandler";
import { authenticate } from "../src/InterfaceAdapters/Middleware/authenticateAccessToken";
import { SERVICE_TOKENS } from "../src/Infrastructure/DI/Tokens/ServiceTokens";

interface MockResponse {
    statusCode: number;
    jsonBody: unknown;
    status(code: number): MockResponse;
    json(body: unknown): MockResponse;
}

interface JwtServiceFixture {
    service: IJwtService;
    accessTokenCalls: string[];
    refreshTokenCalls: string[];
}

const createJwtService = (): JwtServiceFixture => {
    const accessTokenCalls: string[] = [];
    const refreshTokenCalls: string[] = [];

    const service: IJwtService = {
        generateAccessToken: (userId) => `access:${userId}`,
        generateRefreshToken: (userId) => `refresh:${userId}`,
        verifyAccessToken: (token) => {
            accessTokenCalls.push(token);

            if (token === "valid-access-token") {
                return { userId: "user-123" };
            }

            if (token === "expired-token") {
                throw new jwt.TokenExpiredError("jwt expired", new Date(0));
            }

            if (token === "refresh-token") {
                throw new jwt.JsonWebTokenError("Invalid access token");
            }

            throw new jwt.JsonWebTokenError("jwt malformed");
        },
        verifyRefreshToken: (token) => {
            refreshTokenCalls.push(token);
            return { userId: "user-123" };
        }
    };

    return { service, accessTokenCalls, refreshTokenCalls };
};

const createRequest = (authorization?: string): Request => ({
    headers: { authorization }
} as unknown as Request);

const createResponse = (): MockResponse => ({
    statusCode: 0,
    jsonBody: undefined,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(body) {
        this.jsonBody = body;
        return this;
    }
});

const invokeMiddleware = (
    authorization: string | undefined,
    jwtService: IJwtService
): { request: Request; response: MockResponse; nextCalled: boolean; error: unknown } => {
    container.reset();
    container.register<IJwtService>(SERVICE_TOKENS.IJwtService, { useValue: jwtService });

    const request = createRequest(authorization);
    const response = createResponse();
    let nextCalled = false;
    let error: unknown;
    const next: NextFunction = (nextError?: unknown) => {
        if (nextError !== undefined) {
            error = nextError;
        } else {
            nextCalled = true;
        }
    };

    authenticate(request, response as unknown as Response, next);

    if (error !== undefined) {
        errorHandler(error, request, response as unknown as Response, next);
    }

    container.reset();
    return { request, response, nextCalled, error };
};

const assertUnauthorized = (response: MockResponse): void => {
    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.jsonBody, {
        success: false,
        message: "Unauthorized"
    });
};

test("missing access token returns the consistent 401 response", () => {
    const fixture = createJwtService();
    const result = invokeMiddleware(undefined, fixture.service);

    assert.ok(result.error instanceof AppError);
    assertUnauthorized(result.response);
    assert.deepEqual(fixture.accessTokenCalls, []);
});

test("malformed authorization headers return 401 without verifying a token", () => {
    const malformedHeaders = [
        "Basic valid-access-token",
        "Bearer",
        "Bearer ",
        "Bearer token extra",
        "Bearer token "
    ];

    for (const authorization of malformedHeaders) {
        const fixture = createJwtService();
        const result = invokeMiddleware(authorization, fixture.service);

        assert.ok(result.error instanceof AppError, authorization);
        assertUnauthorized(result.response);
        assert.deepEqual(fixture.accessTokenCalls, [], authorization);
    }
});

test("invalid access tokens return the consistent 401 response", () => {
    const fixture = createJwtService();
    const result = invokeMiddleware("Bearer invalid-token", fixture.service);

    assert.ok(result.error instanceof AppError);
    assertUnauthorized(result.response);
    assert.deepEqual(fixture.accessTokenCalls, ["invalid-token"]);
});

test("expired access tokens return the consistent 401 response", () => {
    const fixture = createJwtService();
    const result = invokeMiddleware("Bearer expired-token", fixture.service);

    assert.ok(result.error instanceof AppError);
    assertUnauthorized(result.response);
    assert.deepEqual(fixture.accessTokenCalls, ["expired-token"]);
});

test("refresh tokens are rejected through verifyAccessToken, never verifyRefreshToken", () => {
    const fixture = createJwtService();
    const result = invokeMiddleware("Bearer refresh-token", fixture.service);

    assert.ok(result.error instanceof AppError);
    assertUnauthorized(result.response);
    assert.deepEqual(fixture.accessTokenCalls, ["refresh-token"]);
    assert.deepEqual(fixture.refreshTokenCalls, []);
});

test("valid access token attaches the user ID and continues the request", () => {
    const fixture = createJwtService();
    const result = invokeMiddleware("Bearer valid-access-token", fixture.service);

    assert.equal(result.error, undefined);
    assert.equal(result.nextCalled, true);
    assert.deepEqual(result.request.auth, { userId: "user-123" });
    assert.deepEqual(fixture.accessTokenCalls, ["valid-access-token"]);
    assert.deepEqual(fixture.refreshTokenCalls, []);
});
