﻿using System;
using System.Collections.Generic;
using System.Text;

namespace amadeus.resources
{
    /// <summary>
    /// An Description object.
    /// </summary>
    public class Description
    {
        internal Description() { }

        /// <summary>
        /// Gets or sets the descriptionType.
        /// </summary>
        /// <value>The descriptionType.</value>
        public string descriptionType { get; set; }

        /// <summary>
        /// Gets or sets the text.
        /// </summary>
        /// <value>The text.</value>
        public string text { get; set; }
    }
}
