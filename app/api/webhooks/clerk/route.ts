import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";

import { IncomingHttpHeaders } from "http";

import { NextResponse } from "next/server";

type EventType =
    | "user.created"
    | "email.created"
    | "user.updated"
    | "user.deleted";
type Event = {
    data: Record<string, string | number | Record<string, string>[]>;
    object: "event";
    type: EventType;
};

export const POST = async (request: Request) => {
    const payload = await request.json();
    const header = headers();

    const heads = {
        "svix-id": header.get("svix-id"),
        "svix-timestamp": header.get("svix-timestamp"),
        "svix-signature": header.get("svix-signature"),
    };

    // Activitate Webhook in the Clerk Dashboard.
    // After adding the endpoint, you'll see the secret on the right side.
    const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

    let evnt: Event | null = null;

    try {
        evnt = wh.verify(
            JSON.stringify(payload),
            heads as IncomingHttpHeaders & WebhookRequiredHeaders
        ) as Event;
    } catch (err) {
        return NextResponse.json({ message: err }, { status: 400 });
    }

    const eventType: EventType = evnt?.type!;

    // Listen organization creation event
    if (eventType === "user.created") {
        // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
        // Show what evnt?.data sends from above resource
        const { id, name, slug, logo_url, image_url, created_by } =
            evnt?.data ?? {};

        try {
            // @ts-ignore
            await createCommunity(
                // @ts-ignore
                id,
                name,
                slug,
                logo_url || image_url,
                "org bio",
                created_by
            );

            return NextResponse.json({ message: "User created" }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    // Listen organization invitation creation event.
    // Just to show. You can avoid this or tell people that we can create a new mongoose action and
    // add pending invites in the database.
    if (eventType === "email.created") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
            console.log("Invitation created", evnt?.data);

            return NextResponse.json(
                { message: "Invitation created" },
                { status: 201 }
            );
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }


    // Listen member deletion event
    if (eventType === "user.deleted") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
            // Show what evnt?.data sends from above resource
            const { organization, public_user_data } = evnt?.data;
            console.log("removed", evnt?.data);

            // @ts-ignore
            await removeUserFromCommunity(public_user_data.user_id, organization.id);

            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }

    // Listen organization updation event
    if (eventType === "user.updated") {
        try {
            // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
            // Show what evnt?.data sends from above resource
            const { id, logo_url, name, slug } = evnt?.data;
            console.log("updated", evnt?.data);

            // @ts-ignore
            await updateCommunityInfo(id, name, slug, logo_url);

            return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
            console.log(err);

            return NextResponse.json(
                { message: "Internal Server Error" },
                { status: 500 }
            );
        }
    }
};