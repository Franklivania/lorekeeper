//! LoreKeeper on-chain program — MVP scaffold.
//! Extend with register_player, create_character, sessions, relics, etc.

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFLSn");

#[program]
pub mod lorekeeper {
    use super::*;

    /// Heartbeat instruction to verify deployment and IDL wiring.
    pub fn ping(_ctx: Context<Ping>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Ping {}
