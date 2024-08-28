interface Bio {
  text: string;
}

interface Profile {
  bio: Bio;
}

interface VerifiedAddresses {
  eth_addresses: string[];
  sol_addresses: string[];
}

interface UserHydrated {
  object: "user";
  fid: number;
  custody_address: string;
  username: string;
  display_name: string | null;
  pfp_url: string | null;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: "inactive" | "active";
  power_badge: boolean;
  event_timestamp: string; // ISO 8601 format
}

interface UserDehydrated {
  object: "user_dehydrated";
  fid: number;
  username: string;
}

interface CustomHeaders {
  "x-convoy-message-type": "broadcast";
}

interface EmbedUrlMetadata {
  content_type?: string | null;
  content_length?: number | null;
}

interface EmbedUrl {
  url: string;
  metadata?: EmbedUrlMetadata;
}

interface CastId {
  fid: number;
  hash: string;
}

interface EmbedCastId {
  cast_id: CastId;
}

type EmbeddedCast = EmbedUrl | EmbedCastId;

interface CastDehydrated {
  object: "cast_dehydrated";
  hash: string;
  author: UserDehydrated;
}

interface CastCreatedEventData {
  object: "cast";
  hash: string;
  parent_hash?: string | null;
  parent_url?: string | null;
  root_parent_url?: string | null;
  parent_author?: {
    fid?: number | null;
  };
  author: UserHydrated;
  mentioned_profiles?: UserHydrated[];
  text: string;
  timestamp: string; // ISO 8601 format
  embeds: EmbeddedCast[];
}

interface FollowCreatedEventData {
  object: "follow";
  event_timestamp: string; // ISO 8601 format
  timestamp: string; // ISO 8601 format with timezone
  user: UserDehydrated;
  target_user: UserDehydrated;
}

interface FollowDeletedEventData {
  object: "unfollow";
  event_timestamp: string; // ISO 8601 format
  timestamp: string; // ISO 8601 format with timezone
  user: UserDehydrated;
  target_user: UserDehydrated;
}

interface ReactionCreatedEventData {
  object: "reaction";
  event_timestamp: string; // ISO 8601 format
  timestamp: string; // ISO 8601 format with timezone
  reaction_type: number;
  user: UserDehydrated;
  cast: CastDehydrated;
}

interface ReactionDeletedEventData {
  object: "reaction";
  event_timestamp: string; // ISO 8601 format
  timestamp: string; // ISO 8601 format with timezone
  reaction_type: number;
  user: UserDehydrated;
  cast: CastDehydrated;
}

interface UserCreatedEvent {
  event_type: "user.created";
  data: UserHydrated;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

interface UserUpdatedEvent {
  event_type: "user.updated";
  data: UserHydrated;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

interface CastCreatedEvent {
  event_type: "cast.created";
  data: CastCreatedEventData;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

interface FollowCreatedEvent {
  event_type: "follow.created";
  data: FollowCreatedEventData;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

interface FollowDeletedEvent {
  event_type: "follow.deleted";
  data: FollowDeletedEventData;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

interface ReactionCreatedEvent {
  event_type: "reaction.created";
  data: ReactionCreatedEventData;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}
interface ReactionDeletedEvent {
  event_type: "reaction.deleted";
  data: ReactionDeletedEventData;
  custom_headers: CustomHeaders;
  idempotency_key?: string;
}

export type FarcasterEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | CastCreatedEvent
  | FollowCreatedEvent
  | FollowDeletedEvent
  | ReactionCreatedEvent
  | ReactionDeletedEvent;
